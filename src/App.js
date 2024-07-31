import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Swap from "./components/Swap";
import Pool from "./components/Pool";
import Deposit from "./components/Deposit";
import AddLiquidity from "./components/AddLiquidity";
import Layout from "./components/Layout";
import React from "react";
import RemoveLiquidity from "./components/RemoveLiquidity";

function App() {
    return (
        <div className="App">
            <React.Fragment>
                <BrowserRouter>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Layout>
                                    <Swap />
                                </Layout>
                            }
                        />
                    </Routes>
                    <Routes>
                        <Route
                            path="/pool"
                            element={
                                <Layout>
                                    <Pool />
                                </Layout>
                            }
                        />
                    </Routes>
                    <Routes>
                        {/* <Route
                            path="/deposit"
                            element={
                                <Layout>
                                    <Deposit />
                                </Layout>
                            }
                        /> */}
                    </Routes>
                    <Routes>
                        <Route
                            path="/pool/addliquidity/:address1/:address2"
                            element={
                                <Layout>
                                    <AddLiquidity />
                                </Layout>
                            }
                        />
                    </Routes>
                    <Routes>
                        <Route
                            path="/remove/liquidity/:pairAddress"
                            element={
                                <Layout>
                                    <RemoveLiquidity />
                                </Layout>
                            }
                        />
                    </Routes>
                </BrowserRouter>
            </React.Fragment>
        </div>
    );
}

export default App;
