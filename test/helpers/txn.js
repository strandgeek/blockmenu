const { waitFor } = require('./waitFor');

const waitForTxnInfo = (txnId) => waitFor(() => tronWeb.trx.getTransactionInfo(txnId), info => info.receipt && !!info.receipt.result);

const expectTxnSuccess = async (txn) => {
  const txnId = await txn;
  const info = await waitForTxnInfo(txnId);
  expect(info.receipt.result).to.be.equal('SUCCESS');
}

const expectTxnRevert = async (txn) => {
  const txnId = await txn;
  const info = await waitForTxnInfo(txnId);
  expect(info.receipt.result).to.be.equal('REVERT');
  return info;
}

const getTxnInfoErrorMessage = (info) => {
  if (!info || !info.contractResult || info.contractResult <= 0) {
    return;
  }
  const errFullMessage = info.contractResult[0];
  return Buffer.from(errFullMessage, "hex").toString();
}

const expectTxnRevertWith = async (txn, revertMessage) => {
  const info = await expectTxnRevert(txn);
  expect(info.contractResult).to.have.length(1);
  expect(getTxnInfoErrorMessage(info)).to.contain(revertMessage);
}

module.exports = {
  expectTxnSuccess,
  expectTxnRevert,
  expectTxnRevertWith,
};
