export default {
  register(app) {
    app.addMenuLink({
      to: "/plugins/custom-page",
      icon: () => "📄",
      intlLabel: {
        id: "custom-page.name",
        defaultMessage: "My Page",
      },
      Component: () => (
        <div style={{ padding: "20px" }}>
          <h1>Custom Page</h1>
          <p>Add your content here!</p>
        </div>
      ),
    });

    app.registerPlugin({
      id: "custom-page",
      name: "custom-page",
    });
  },
};
