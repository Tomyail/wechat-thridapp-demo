import axios from 'axios';
import { createHashHistory } from 'history';
import qs from 'qs';
import { useEffect, useState } from 'react';
import { Link, Route, Router, Switch } from 'react-router-dom';
import './App.css';
import AgentApp from './demo/AgentApp';
import ConfigApp from './demo/ConfigApp';
import MergeApp from './demo/MergeApp';
import { getQuery, nativeLocationToLib } from './utils/get-query';

const history = createHashHistory();

const RootRouter = () => {
  //
  // history.location
  const [query, setQuery] = useState(
    getQuery(nativeLocationToLib())
  );
  const [user, setUser] = useState({});
  useEffect(() => {
    if (query.code) {
      axios
        .get(`${process.env.REACT_APP_SERVER_HOST}/api/user-info`, {
          params: { code: query.code },
        })
        .then(({ data }) => {
          setUser(data);
        });
    }
    return history.listen((location) => {
      setQuery(getQuery(location));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Router history={history}>
      <div>
        <div>{`userInfo: ${JSON.stringify(user)}`}</div>
        <button>
          <Link to={{ pathname: '/agent', search: `?${qs.stringify(query)}` }}>
            agent
          </Link>
        </button>
        <button>
          <Link to={{ pathname: '/config', search: `?${qs.stringify(query)}` }}>
            config
          </Link>
        </button>
        <button>
          <Link to={{ pathname: '/merge', search: `?${qs.stringify(query)}` }}>
            merge
          </Link>
        </button>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/agent">
            <AgentApp />
          </Route>
          <Route path="/config">
            <ConfigApp />
          </Route>
          <Route path="/merge">
            <MergeApp />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <RootRouter />
      </header>
    </div>
  );
}

export default App;
