import GlitterBridgeSdk from "../src/GlitterBridgeSDK";

 const glitterBridgeSdk = new GlitterBridgeSdk()
 .connectToAlgorand(
     "https://node.algoexplorerapi.io",
     "",
     "https://algoindexer.algoexplorerapi.io",
     "",
     "",
     98624397
 )
 .connectToSolana("https://api.mainnet-beta.solana.com")