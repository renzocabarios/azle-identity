import { useEffect, useState } from 'react';
import './App.css';
import azleLogo from './assets/azle_logo.svg';
import azleShadow from './assets/azle_shadow.png';
import reactLogo from './assets/react.svg';
import viteLogo from './assets/vite.svg';
import { backend } from './declarations/backend';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';
function App() {
  const [count, setCount] = useState<number | undefined>();
  const [principal, setPrincipal] = useState<string | undefined>(undefined);
  const [_, setIdentity] = useState<Identity | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const fetchCount = async () => {
    try {
      setLoading(true);
      const count = (await backend.getAllUsers()).reduce(
        (acc: any, curr: any) => acc++,
        0,
      );
      setCount(+count.toString()); // Convert BigInt to number
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch the count on page load
  useEffect(() => {
    fetchCount();
  }, []);

  const login = async () => {
    const authClient = await AuthClient.create();
    const isLocalNetwork = process.env.DFX_NETWORK == 'local';
    const identityProviderUrl = isLocalNetwork
      ? `http://127.0.0.1:4943/?canisterId=${process.env.CANISTER_ID_INTERNET_IDENTITY}`
      : 'https://identity.ic0.app/';

    authClient.login({
      identityProvider: identityProviderUrl,
      maxTimeToLive: BigInt(7 * 24 * 60 * 60 * 1000 * 1000 * 1000),
      onSuccess: async () => {
        const identity = await authClient.getIdentity();
        const principal = identity.getPrincipal().toString();
        setPrincipal(principal);
        setIdentity(identity);
      },
    });
  };

  return (
    <>
      <div className="navbar"></div>
      <div className="App">
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo vite" alt="Vite logo" />
          </a>
          <a href="https://reactjs.org" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <a href="https://github.com/demergent-labs/azle" target="_blank">
            <span className="logo-stack">
              <img
                src={azleShadow}
                className="logo azle-shadow"
                alt="azle logo"
              />
              <img src={azleLogo} className="logo azle" alt="Azle logo" />
            </span>
          </a>
        </div>
        <h1>Vite + React + Azle</h1>
        <div className="card">
          <button onClick={login}>
            {principal ? principal : 'Connect Identity'}
          </button>
        </div>
        <p className="read-the-docs">Current Users {count}</p>
      </div>
    </>
  );
}

export default App;
