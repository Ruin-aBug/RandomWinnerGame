import axios from "axios";

type Game = {
	id: number;
	maxPlayers: number;
	entryFee: number;
	winner: string;
	players: Array<string>
}

type GameArray = {
	games: Game[]
}

export async function subgraphQuery(query: string): Promise<GameArray> {
	try {
		const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/ruin-abug/learnweb3";
		const response = await axios.post(SUBGRAPH_URL, { query });
		if (response.data.errors) {
			console.error(response.data.errors);
			throw new Error(`Error making subgraph query ${response.data.errors}`);
		}
		return response.data.data;
	} catch (error) {
		console.error(error);
		throw new Error(`Could not query the subgraph ${error}`);
	}

}