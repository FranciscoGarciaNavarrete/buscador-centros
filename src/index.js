import React from 'react';
import ReactDOM from 'react-dom';

import ListProv from './components/ListProv'

import './common/styles/index.scss';

const App = () => {
	return <ListProv />;
};

class WebComponent extends HTMLElement {
	connectedCallback() {
		ReactDOM.render(
			<App />,
			this
		);
	}
}

const ELEMENT_ID = 'buscar-centros-app';

if(!customElements.get(ELEMENT_ID)){
  customElements.define(ELEMENT_ID, WebComponent);
}
