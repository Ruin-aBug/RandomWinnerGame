import { ethers } from "hardhat";
import { DeployFunction } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

const LINK_TOKEN = "0x326C977E6efc84E512bB9C30f76E30c160eD06FB";
const VRF_WRAPPER = "0x708701a1DfF4f478de54383E49a627eD4852C816";
const VRF_COORDINATOR = "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D";
const FEE = ethers.utils.parseEther("0.0001");

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
	const { deployments, getChainId, getNamedAccounts } = hre;
	const { deploy } = deployments;
	const { deployer } = await getNamedAccounts();
	const chainId = await getChainId();

	const args = [LINK_TOKEN, VRF_WRAPPER, FEE];

	const gameContract = await deploy("RandomWinnerGame", {
		from: deployer,
		log: true,
		args: args
	});

	console.log("random winner game address:", gameContract.address);

	if (chainId !== "31337") {
		await hre.run("verify:verify", {
			address: gameContract.address,
			contract: "contracts/RandomWinnerGame.sol:RandomWinnerGame",
			constructorArguments: args
		})
	}
}

export default func;
func.tags = ["game"];