export const farms = [
    {
        network: 11155111,
        contract: "0x676f9F8E2E33C5989fEb1d32b78d4a982B046edc",
        rewardToken: '0x30491f00d98efbfd0b2c1a769d493cd79d03547e', // MT token
        pools: [
            {
                poolId: 0,
                stakeToken: "0xe9c7A1093a797aFcD6aeba65ea6a17AD610Cf019", // MKA token
                timeLock: 50000,
                fee: 5,
                token0: '0xe9c7A1093a797aFcD6aeba65ea6a17AD610Cf019',
                token1: '0xe9c7A1093a797aFcD6aeba65ea6a17AD610Cf019'
            },
            // {
            //     stakeToken: '0x30491f00d98efbfd0b2c1a769d493cd79d03547e', // MKA token
            //     timeLock: 60 * 60 * 24 * 30,
            //     fee: 5,
            //     token0: '0x30491f00d98efbfd0b2c1a769d493cd79d03547e',
            //     token1: '0x30491f00d98efbfd0b2c1a769d493cd79d03547e'
            // }
        ]
    }
]
