<template>
  <fa :icon="iconName" @click="e => $emit('click', e)"></fa>
</template>
<script>
export default {
  props: {
    icon: {
      type: String,
      default: 'add',
    },
  },
  computed: {
    iconName() {
      const conversion = {
        handle: 'grip-lines',
        grip: 'grip-vertical',
        menu: 'bars',
        edit: 'pen',
        editSquare: 'pen-to-square',
        save: 'floppy-disk',
        duplicate: 'clone',
        add: 'plus',
        close: 'xmark',
        remove: 'xmark',
        collection: 'object-group',
        delete: 'trash',
        copy: 'clipboard',
        'copy-colors': 'clipboard',
        send: 'arrow-up-right-from-square',
        move: 'arrow-up-right-from-square',
        rename: 'i-cursor',
        palettes: 'swatchbook',
        collection: 'obect-group',
        collections: 'layer-group',
        search: 'magnifying-glass',
        home: 'house',
        custom: 'droplet',
        color: 'droplet',
      };
      return Object.keys(conversion).includes(this.icon)
        ? conversion[this.icon]
        : this.icon;
    },
  },
};
</script>
