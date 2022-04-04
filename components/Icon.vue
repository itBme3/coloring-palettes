<template>
  <fa :icon="iconName"></fa>
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
        collections: 'obect-group',
        search: 'magnifying-glass',
      };
      return Object.keys(conversion).includes(this.icon)
        ? conversion[this.icon]
        : this.icon;
    },
  },
};
</script>
