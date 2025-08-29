import React from 'react';

interface App {
  addMenuLink: (config: {
    to: string;
    icon: () => string;
    intlLabel: {
      id: string;
      defaultMessage: string;
    };
    Component: () => JSX.Element;
  }) => void;
}

export default {
  config: {},
  bootstrap(app: App) {
    app.addMenuLink({
      to: '/custom-page',
      icon: () => '📄',
      intlLabel: {
        id: 'custom-page',
        defaultMessage: 'Custom Page',
      },
      Component: async () => {
        return () => (
          <div style={{ padding: '20px' }}>
            <h1>My Custom Page</h1>
            <p>This is working!</p>
          </div>
        );
      },
    });
  },
};