import { BigNumber, Contract, providers, utils } from "ethers";
import { Web3Provider, JsonRpcSigner } from "@ethersproject/providers";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import {
    RandomWinnerGame,
    RandomWinnerGame__factory,
    RANDOM_WINNER_GAME_ADDRESS,
} from "../constants";
import { subgraphQuery } from "../utils";
import { FETCH_CREATED_GAME } from "../queries";

export default function Home() {
    const zero = BigNumber.from("0");
    const [walletConnected, setWalletConnected] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [entryFee, setEntryFee] = useState<BigNumber>(zero);
    const [maxPlayers, setMaxPlayers] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [players, setPlayers] = useState<Array<string>>([]);
    const [winner, setWinner] = useState<string>();
    const [logs, setLogs] = useState<Array<string>>([]);
    const web3ModalRef = useRef<Web3Modal>();

    const forceUpdate = React.useReducer(() => ({}), {})[1];

    async function getProviderOrSigner(
        isSigner: boolean = false
    ): Promise<Web3Provider | JsonRpcSigner> {
        const provider = await web3ModalRef.current?.connect();
        const web3Provider = new providers.Web3Provider(provider);
        const { chainId } = await web3Provider.getNetwork();
        if (chainId !== 5) {
            window.alert("Change the network to Mumbai");
            throw new Error("Change network to Mumbai");
        }

        if (isSigner) {
            const signer = web3Provider.getSigner();
            return signer;
        }
        return web3Provider;
    }

    async function connectWallet() {
        try {
            await getProviderOrSigner();
            setWalletConnected(true);
        } catch (err) {
            console.error(err);
        }
    }

    async function getContract(
        isSigner: boolean = false
    ): Promise<RandomWinnerGame> {
        try {
            let providerOrSigner: Web3Provider | JsonRpcSigner;
            providerOrSigner = await getProviderOrSigner(isSigner);
            const contract = RandomWinnerGame__factory.connect(
                RANDOM_WINNER_GAME_ADDRESS,
                providerOrSigner
            );
            return contract;
        } catch (err) {
            console.error(err);
            throw new Error("Error: new Contract Error!");
        }
    }

    async function startGame() {
        try {
            const contract = await getContract(true);
            setLoading(true);
            const tx = await contract.startGame(maxPlayers, entryFee);
            await tx.wait();
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    async function joinGame() {
        try {
            const contract = await getContract(true);
            setLoading(true);
            const tx = await contract.joinGame({ value: entryFee });
            await tx.wait();
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    async function checkIfGameStarted() {
        try {
            const contract = await getContract();
            const _gameStarted = await contract.gameStarted();
            const _gameArray = await subgraphQuery(FETCH_CREATED_GAME());
            const _game = _gameArray.games[0];
            let _logs: Array<string> = [];
            if (_gameStarted) {
                _logs = [`Game has started with ID: ${_game.id}`];
                if (_game.players && _game.players.length > 0) {
                    _logs.push(
                        `${_game.players.length} / ${_game.maxPlayers} already joined 👀 `
                    );
                    _game.players.forEach((player) => {
                        _logs.push(`${player} joined 🏃‍♂️`);
                    });
                }
                setEntryFee(BigNumber.from(_game.entryFee));
                setMaxPlayers(_game.maxPlayers);
            } else if (!gameStarted && _game.winner) {
                _logs = [
                    `Last game has ended with ID: ${_game.id}`,
                    `Winner is: ${_game.winner} 🎉 `,
                    `Waiting for host to start new game....`,
                ];

                setWinner(_game.winner);
            }
            setLogs(_logs);
            setPlayers(_game.players);
            setGameStarted(_gameStarted);
            forceUpdate();
        } catch (err) {
            console.error(err);
        }
    }

    async function getOwner() {
        try {
            const contract = await getContract();
            const _owner = await contract.owner();
            const signer = (await getProviderOrSigner(true)) as JsonRpcSigner;
            const address = await signer.getAddress();
            if (address.toLowerCase() === _owner.toLowerCase()) {
                setIsOwner(true);
            }
        } catch (err) {
            console.error(err);
        }
    }

    useEffect(() => {
        if (!walletConnected) {
            web3ModalRef.current = new Web3Modal({
                network: "goerli",
                providerOptions: {},
                disableInjectedProvider: false,
            });
            connectWallet();
            getOwner();
            checkIfGameStarted();
            setInterval(() => {
                checkIfGameStarted();
            }, 2000);
        }
    }, [walletConnected]);

    const renderButton = () => {
        if (!walletConnected) {
            return (
                <button onClick={connectWallet} className={styles.button}>
                    Connect your wallet
                </button>
            );
        }

        // If we are currently waiting for something, return a loading button
        if (loading) {
            return <button className={styles.button}>Loading...</button>;
        }
        // Render when the game has started
        if (gameStarted) {
            if (players.length === maxPlayers) {
                return (
                    <button className={styles.button} disabled>
                        Choosing winner...
                    </button>
                );
            }
            return (
                <div>
                    <button className={styles.button} onClick={joinGame}>
                        Join Game 🚀
                    </button>
                </div>
            );
        }
        // Start the game
        if (isOwner && !gameStarted) {
            return (
                <div>
                    <input
                        type="number"
                        className={styles.input}
                        onChange={(e) => {
                            // The user will enter the value in ether, we will need to convert
                            // it to WEI using parseEther
                            setEntryFee(
                                parseInt(e.target.value) >= 0
                                    ? utils.parseEther(
                                          e.target.value.toString()
                                      )
                                    : zero
                            );
                        }}
                        placeholder="Entry Fee (ETH)"
                    />
                    <input
                        type="number"
                        className={styles.input}
                        onChange={(e) => {
                            // The user will enter the value for maximum players that can join the game
                            setMaxPlayers(parseInt(e.target.value) ?? 0);
                        }}
                        placeholder="Max players"
                    />
                    <button className={styles.button} onClick={startGame}>
                        Start Game 🚀
                    </button>
                </div>
            );
        }
    };

    return (
        <div>
            <Head>
                <title>LW3Punks</title>
                <meta name="description" content="LW3Punks-Dapp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className={styles.main}>
                <div>
                    <h1 className={styles.title}>
                        Welcome to Random Winner Game!
                    </h1>
                    <div className={styles.description}>
                        Its a lottery game where a winner is chosen at random
                        and wins the entire lottery pool
                    </div>
                    {renderButton()}
                    {logs &&
                        logs.map((log, index) => (
                            <div className={styles.log} key={index}>
                                {log}
                            </div>
                        ))}
                </div>
                <div>
                    <img className={styles.image} src="./randomWinner.png" />
                </div>
            </div>

            <footer className={styles.footer}>
                Made with &#10084; by Your Name
            </footer>
        </div>
    );
}
