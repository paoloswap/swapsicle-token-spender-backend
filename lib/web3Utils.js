require("dotenv").config();
const { ethers, BigNumber } = require("ethers");
const ABI_ERC20 = require("../constants/abi_erc20");
const { CHAIN_INFO } = require("../constants/chainInfo");
const { LowBalanceError } = require("./errors");
const { Webhook } = require("discord-webhook-node");
const Logger = require("./logger");

function toETH(number) {
  return ethers.utils.formatEther(number.toString());
}

function toEthFixed(number, maxDecimals) {
  let eth = ethers.utils.formatEther(number.toString());
  return maxDecimals == 0 ? Math.ceil(eth) : parseFloat(eth).toFixed(maxDecimals);
}

function toWei(number) {
  return ethers.utils.parseEther(number.toString())
}

const getProvider = (rpcAddress) => {
  rpcAddress = rpcAddress || process.env.RPC_URL;
  return new ethers.providers.JsonRpcProvider(rpcAddress);
}

const getSigner = (privateKey, provider) => {
  provider = provider || getProvider();
  return privateKey ? new ethers.Wallet(privateKey, provider) : undefined;
}

const getContract = (address, abi, rpcAddress, privateKey) => {
  const provider = getProvider(rpcAddress);
  const signer = getSigner(privateKey, provider);
  return new ethers.Contract(address, abi, signer || provider);
}

const getErc20Token = (address, chainId) => {
  const rpcUrl = CHAIN_INFO[chainId || process.env.CHAIN_ID].rpcUrl;
  return getContract(
    address,
    ABI_ERC20,
    rpcUrl,
    process.env.PRIVATE_KEY
  );
}

// Throw on low balance (given a token and an amount in wei)
const throwOnLowBalance = async (token, symbol, amount) => {
  let signer = await getSigner(process.env.PRIVATE_KEY);
  let account = signer.address;
  // console.log(`${symbol} (${token.address}) balance of ${account}`);
  let availableBalance = await token.balanceOf(account);
  // console.log(`Available ${symbol} balance: ${toEthFixed(availableBalance, 0)} (needed: ${toEthFixed(amount, 0)})`)
  if (BigNumber.from(availableBalance.toString()).lt(BigNumber.from(amount.toString()))) {
    let info = CHAIN_INFO[process.env.CHAIN_ID];
    throw new LowBalanceError(
      `Insufficient ${symbol} balance: ${toEthFixed(availableBalance, 0)} (needed: ${toEthFixed(amount, 0)}) ` +
      `Please top up ${symbol} to ${account} on ${info.name} asap.`
    );
  }
}

const throwOnLowGas = async (chainId) => {
  let info = CHAIN_INFO[chainId];
  let provider = await getProvider(info.rpcUrl);
  let signer = await getSigner(process.env.PRIVATE_KEY, provider);
  let account = signer.address;
  let availableBalance = await signer.getBalance();
  let lowAmount = BigNumber.from(toWei(info.lowGasAmount).toString());
  let criticallyLowGasAmount = BigNumber.from(toWei(info.criticallyLowGasAmount).toString());
  let errorMessage = `Low gas: ${toEthFixed(availableBalance, 4)} (should be > ${toEthFixed(lowAmount, 0)}) ` +
    `Please top up ${account} on ${info.name} asap.`;
  if (BigNumber.from(availableBalance.toString()).lt(criticallyLowGasAmount)) {
    await notifyOnDiscord(`@here ${errorMessage}`);
  } else if (BigNumber.from(availableBalance.toString()).lt(BigNumber.from(lowAmount.toString()))) {
    await notifyOnDiscord(errorMessage);
  }
}

const notifyOnDiscord = async (message) => {
  if (process.env.DISCORD_WEBHOOK) {
    try {
      const discordHook = new Webhook(process.env.DISCORD_WEBHOOK);
      const discordNotification = message;
      Logger.info(`Sending Discord notification: ${discordNotification}`);
      await discordHook.send(discordNotification);
    } catch (e) {
      Logger.error(`Could not send Discord notification: ${e.message}`);
      if (process.env.DEBUG) console.log(e);
    }
  } else {
    if (process.env.DEBUG) console.log("No Discord webhook configured");
  }
}

module.exports = {
  toETH,
  toEthFixed,
  toWei,
  getProvider,
  getSigner,
  getContract,
  getErc20Token,
  throwOnLowBalance,
  throwOnLowGas,
  notifyOnDiscord,
}