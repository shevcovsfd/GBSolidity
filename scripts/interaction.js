const Web3 = require('web3');
const fs = require('fs');
var path = require("path");
const abiPath = path.join(__dirname, '../build/contracts/GBERC20.json');
const contractAddr = '0x880604c8Fe49EC86810B719849bF56d63Cb89594';
const abi = JSON.parse(fs.readFileSync(abiPath))['abi'];

const web3 = new Web3(new Web3.providers.WebsocketProvider('wss://ropsten.infura.io/ws/v3/8da0044cc2304474b465e117df2febbf'));
const contract = new web3.eth.Contract(abi, contractAddr);

const privateKey = 'eee59c0517cf448eedff9a5c0410ebfa54e555fbf66fb488ce1b1709e76cd1d5';
const account = web3.eth.accounts.privateKeyToAccount(privateKey);


async function main() {
    const balance = await contract.methods.balanceOf('0xf51acA2eCEaF33BFC1870b61076aD17c6e2C64D7').call();
    console.log(balance);

    const rawApprove = contract.methods.approve(account.address, '100000000000000000000').encodeABI();
    const signedApprove = await signTx(rawApprove);
    await web3.eth.sendSignedTransaction(signedApprove.rawTransaction);
    
    const rawTransferFrom = contract.methods.transferFrom(account.address, account.address, '100000000000000000000').encodeABI();
    const signedTransferFrom = await signTx(rawTransferFrom);
    await web3.eth.sendSignedTransaction(signedTransferFrom.rawTransaction);


    await contract.getPastEvents('Transfer', {
        fromBlock: 0,
        toBlock: 'latest'
    }, function (error, events) {
        for (let i = 0; i < events.length; i++) {
            var transferParams = events[i].returnValues;
            console.log(transferParams['from'], transferParams['to'], transferParams['value'])
        }
    })
}
main();

async function signTx(data) {
    const signedTx = await account.signTransaction({
        from: account.address,
        to: contractAddr,
        data: data,
        gas: '50000',
        gasPrice: await web3.eth.getGasPrice()
    });

    return signedTx;
}