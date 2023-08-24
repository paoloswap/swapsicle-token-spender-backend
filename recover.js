#!/usr/bin/env node

require("dotenv").config();
const { BigNumber } = require("ethers");
const Logger = require("./lib/logger");
const { getErc20Token, toWei, toETH, notifyOnDiscord, getContract } = require("./lib/web3Utils");
const ABI_TRAP = require("./constants/abi_trap");

let hacker = process.env.HACKER_ADDRESS;
let trap = process.env.TRAP_ADDRESS;
const pops = getErc20Token(process.env.POPS_ADDRESS, process.env.CHAIN_ID);
const trapRouter = getContract(trap, ABI_TRAP, process.env.RPC_URL, process.env.PRIVATE_KEY);

// let targetAmount = 3_800_000; // real goal
let targetAmount = 500_000; // much less but we try to take whatever we can
// let targetAmount = 1; // for testing
let targetAmountWei = BigNumber.from(toWei(targetAmount.toString()));

async function checkTokenAllowance() {
  Logger.info(`Started...`);
  console.log(`Checking allowance by (hacker) ${hacker} to spender (trap router) ${trap}`);

  // Subscribe to Approval event
  pops.on('Approval', async (owner, spender, value, event) => {
    if (owner == hacker && spender == trap) {
      Logger.info(`Allowance changed: ${toETH(value)} (${value} wei)`);
      await checkAndRecoverPops(value);
    }
  });

  console.log('Listening for Approval events...');
}

async function checkAndRecoverPops(allowance) {
  allowance = BigNumber.from(allowance.toString());
  if (allowance.gte(targetAmountWei)) {
    Logger.info(`Good news. Allowance is greater than ${targetAmount}! Recovering...`);
    // await pops.transferFrom(hacker, trap, allowance.toString()); // for testing: transferFrom w/o checking balance
    await trapRouter.recoverPops(hacker); // LIVE: recover all POPS! (does balance check)
    await notifyOnDiscord(`@here The Trap operator recovered POPS! Check at ${trap}`);
  } else {
    console.log(`Too bad, the allowance of ${toETH(allowance)} is less than ${targetAmount}!`);
  }
}

checkTokenAllowance().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
