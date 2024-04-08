'use client'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {ReactNode} from "react";
import ButtonConnectWallet from "@/components/connectWallet/ButtonConnectWallet";
import SwitchNetworkSelect from "@/components/switchNetwork/SwitchNetworkSelect";
import {Container} from "react-bootstrap";
import {useAccount} from "wagmi";
import styles from './Navbar.module.scss'
import SpinnerIcon from "@/assets/icons/spinnerIcon";

const links = [
    {
        to: '/swap',
        title: 'Swap',
    },
    {
        to: '/liquidity',
        title: 'Liquidity',
    },
    {
        to: '/yieldFarming',
        title: 'Yield Farming',
    },
];

const NavBar: React.FC<{children: ReactNode}> = ({ children}) => {
    const { isConnected } = useAccount();

    return (
        <>
            <Navbar className="justify-content-around p-2" sticky="top" style={{ backgroundColor: '#1b1e29'}}>
                <Container fluid className="gap-3">
                    <Navbar.Brand style={{ color: '#D8D9DA' }}>Falcon</Navbar.Brand>
                    <Navbar.Collapse id="navbarScroll" className="gap-2">
                        <Nav
                            className="me-auto my-2 my-lg-0 gap-2"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        >
                            {links.map((link, index) => (
                                <Nav.Link
                                    key={`nav-link-${index}`}
                                    href={link.to}
                                    className={styles.navLink}
                                >
                                    {link.title}
                                </Nav.Link>
                            ))}
                        </Nav>
                    </Navbar.Collapse>
                    <ButtonConnectWallet/>
                </Container>
            </Navbar>
            {children}
        </>
    );
}

export default NavBar;
