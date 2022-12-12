/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { ethers } from "ethers";
import {
  FactoryOptions,
  HardhatEthersHelpers as HardhatEthersHelpersBase,
} from "@nomiclabs/hardhat-ethers/types";

import * as Contracts from ".";

declare module "hardhat/types/runtime" {
  interface HardhatEthersHelpers extends HardhatEthersHelpersBase {
    getContractFactory(
      name: "LinkTokenInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.LinkTokenInterface__factory>;
    getContractFactory(
      name: "VRFV2WrapperInterface",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VRFV2WrapperInterface__factory>;
    getContractFactory(
      name: "VRFConsumerBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VRFConsumerBase__factory>;
    getContractFactory(
      name: "VRFV2WrapperConsumerBase",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.VRFV2WrapperConsumerBase__factory>;
    getContractFactory(
      name: "Ownable",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Ownable__factory>;
    getContractFactory(
      name: "Lock",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.Lock__factory>;
    getContractFactory(
      name: "RandomWinnerGame",
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<Contracts.RandomWinnerGame__factory>;

    getContractAt(
      name: "LinkTokenInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.LinkTokenInterface>;
    getContractAt(
      name: "VRFV2WrapperInterface",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VRFV2WrapperInterface>;
    getContractAt(
      name: "VRFConsumerBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VRFConsumerBase>;
    getContractAt(
      name: "VRFV2WrapperConsumerBase",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.VRFV2WrapperConsumerBase>;
    getContractAt(
      name: "Ownable",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Ownable>;
    getContractAt(
      name: "Lock",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.Lock>;
    getContractAt(
      name: "RandomWinnerGame",
      address: string,
      signer?: ethers.Signer
    ): Promise<Contracts.RandomWinnerGame>;

    // default types
    getContractFactory(
      name: string,
      signerOrOptions?: ethers.Signer | FactoryOptions
    ): Promise<ethers.ContractFactory>;
    getContractFactory(
      abi: any[],
      bytecode: ethers.utils.BytesLike,
      signer?: ethers.Signer
    ): Promise<ethers.ContractFactory>;
    getContractAt(
      nameOrAbi: string | any[],
      address: string,
      signer?: ethers.Signer
    ): Promise<ethers.Contract>;
  }
}