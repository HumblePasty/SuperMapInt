<template>
  <div id="app">
    <leaflet-draw></leaflet-draw>
  </div>
</template>

<script>
import LeafletDraw from "./components/leafletDraw.vue";

export default {
  name: "App",
  components: {
    LeafletDraw,
  },
  metaInfo() {
    return {
      title: "Leaflet Demo With Vue",
      meta: [
        {
          name: "author",
          content: "RSDonkey",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0",
        },
      ],
    };
  },
  // mounted: () => {
  //   console.log('hello from app.vue')
  // }
};
</script>

<style>
</style>
