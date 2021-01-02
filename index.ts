import * as crypto from "crypto";
// 'crypto' works only after you install @types/node
// This is happening because TypeScript statically analyzes your files and tries to help you with types of data that you're working with.
// If you're using a function written in JavaScript without any hint to TypeScript about what this function is using as arguments and what is the type of its return value,
// it simply cannot do its job, which is why you will get an error.

class Block {
  static computeHash = (
    index: number,
    prevHash: string,
    timestamp: number,
    data: string
  ): string => {
    const salt = index + prevHash + timestamp + data;
    return crypto.createHmac("sha256", salt).toString();
  };

  static validateTypes = (block: Block): boolean => {
    return (
      typeof block.index === "number" &&
      typeof block.hash === "string" &&
      typeof block.previousHash === "string" &&
      typeof block.data === "string" &&
      typeof block.timestamp === "number"
    );
  };

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const firstBlock: Block = new Block(
  0,
  "AJDFBSH",
  "",
  "I am the first block!",
  1234567
);

let blockchain: Block[] = [firstBlock];

const getBlockchain = (): Block[] => {
  return blockchain;
};

const getLastBlock = (): Block => {
  return blockchain[blockchain.length - 1];
};

const getNewTimestamp = (): number => {
  return Math.trunc(new Date().getTime() / 1000);
};

const createNewBlock = (data: string): Block => {
  const prevBlock: Block = getLastBlock();
  const newIndex: number = prevBlock.index + 1;
  const newTimestamp: number = getNewTimestamp();
  const newHash: string = Block.computeHash(
    newIndex,
    prevBlock.hash,
    newTimestamp,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    prevBlock.hash,
    data,
    newTimestamp
  );

  addBlock(newBlock);

  return newBlock;
};

const getHash = (block: Block): string => {
  return Block.computeHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.data
  );
};

const isBlockValid = (candidate: Block, prevBlock: Block): boolean => {
  if (!Block.validateTypes(candidate)) {
    return false;
  } else if (candidate.index !== prevBlock.index + 1) {
    return false;
  } else if (candidate.previousHash !== prevBlock.hash) {
    return false;
  } else if (getHash(candidate) !== candidate.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidate: Block): void => {
  let prevBlock = getLastBlock();
  if (isBlockValid(candidate, prevBlock)) {
    blockchain.push(candidate);
  }
};

createNewBlock("Second Block");
createNewBlock("Third Block");
createNewBlock("Fourth Block");
createNewBlock("Fifth Block");

console.log(blockchain);
