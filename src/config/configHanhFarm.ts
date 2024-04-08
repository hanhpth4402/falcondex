import hanhFarm from "@/config/hanhFarm.json";

export const HanhFarmAddress = "0x8572905a6A4354125EeB3110221a19B1dB19D74E";
export const HanhFarmAddress1 = "0x83Ec067047553B4e1480c89859f1d13111cBcD67";

export const HanhFarmAbi1 = hanhFarm;

export const hanhFarms = [
    {
        network: 11155111,
        contract: HanhFarmAddress1,
        rewardToken: '0xd571C6cCD96085EF481C2B244115F383b6c20226', // reward token = KKK
        pools: [
            {
                poolId: 0,
                stakeToken: "0xe9c7A1093a797aFcD6aeba65ea6a17AD610Cf019", // stake token = MT Token
                timeLock: 5000,
                fee: 5,
                token0: '0xe9c7A1093a797aFcD6aeba65ea6a17AD610Cf019',
                token1: '0xe9c7A1093a797aFcD6aeba65ea6a17AD610Cf019'
            },

            {
                poolId: 1,
                stakeToken: "0x7aa919e9ff1bd8c2a6ed0b7cb25cc188b8c9171c", // stake token = RoboDex V2
                timeLock: 5000,
                fee: 5,
                token0: '0x2DAcbf2E82e5F78564DB1C5005bEC00A34DFBC6F',
                token1: '0xf097Ab5d2E1499672EA7B17aC2e5552D88442D83'
            },
            {
                poolId: 2,
                stakeToken: "0xB361a50b21FC181E16A5019484E1D07A55951f8C", // stake token = RoboDex V2 - FLOWER - WETH
                timeLock: 5000,
                fee: 5,
                token0: '0x41Ddf33AAd71b9aA1354848BFd6bc687E2c6Ab42',
                token1: '0x139D5337deE3f1E3ba77368660715EBe9b1C3B03'
            },
        ]
    }
]
