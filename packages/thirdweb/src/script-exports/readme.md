# Bridge Widget

Add the script in document head and the element where you want to render the bridge widget in your page

```html
<!-- add the bridge-widget script in the head of the document, it adds the `BridgeWidget` global variable to the window object -->
<script src="https://unpkg.com/thirdweb/scripts/bridge-widget.js"></script>

<!-- add a unique id to an element where you want to render the bridge widget -->
<div id="bridge-widget"></div>
```

### Basic Usage

```html
<script>
  // get the element where you want to render the bridge widget
  const node = document.getElementById("bridge-widget");

  // render the widget
  BridgeWidget.render(node, {
    clientId: "your-client-id",
    theme: "dark",
  });
</script>
```

### Custom Theme

```html
<script>
  BridgeWidget.render(node, {
    clientId: "your-client-id",
    theme: {
      type: "dark",
      colors: {
        modalBg: "red",
      },
    },
  });
</script>
```

### Customizing Swap UI

```html
<script>
  BridgeWidget.render(node, {
    clientId: "your-client-id",
    swap: {
      prefill: {
        buyToken: {
          chainId: 8453,
          tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
        },
      },
    },
    buy: {
      chainId: 8453,
      amount: "0.1",
      tokenAddress: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
    },
  });
</script>
```
