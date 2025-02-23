import React, { ReactNode } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import { store, persistor } from "../lib/store";
import { ToastProvider } from "react-toast-plus";

interface WithReduxProviderProps {
	children: ReactNode;
}

const withReduxProvider = <P extends {}>(Component: React.ComponentType<P>) => {
	const WrappedComponent = (props: WithReduxProviderProps) => (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<ToastProvider>{props.children}</ToastProvider>
			</PersistGate>
		</Provider>
	);

	WrappedComponent.displayName = `withReduxProvider(${
		Component.displayName || Component.name || "Component"
	})`;

	return WrappedComponent;
};

export default withReduxProvider;
