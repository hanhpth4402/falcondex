export enum ConnectorNames {
    MetaMask = 'MetaMask',
    RoboWallet = 'RoboWallet',
}

export const ConnectorsInfor: {[nameWallet: string]: {name: string}} = {
    [ConnectorNames.MetaMask]: {
        name: "Meta Mask",
    },
    [ConnectorNames.RoboWallet]: {
        name: "Robo Wallet",
    }
}