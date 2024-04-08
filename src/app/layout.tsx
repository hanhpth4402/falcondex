'use client'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import 'bootstrap/dist/css/bootstrap.min.css'
import Navbar from "@/components/Navbar";
import {WagmiConfig} from "wagmi";
import {client} from "@/config/configWagmi";
import {Container} from "react-bootstrap";
import {ModalProvider} from "@/contexts/ModalContext/Provider";
import { Provider } from 'react-redux'
import store from "@/state/store";
import styles from './Layout.module.scss';

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig client={client}>
          <Provider store={store}>
            <ModalProvider>
              <Container className={`p-2 ${styles.LayoutContainer}`}>
                <Navbar>
                  {children}
                </Navbar>
              </Container>
            </ModalProvider>
          </Provider>
        </WagmiConfig>
      </body>
    </html>
  )
}
