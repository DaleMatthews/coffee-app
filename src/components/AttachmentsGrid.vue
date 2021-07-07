<template>
  <v-container grid-list-sm fluid>
    <v-layout row wrap>

      <v-flex v-for="(attachment, index) in attachments" :key="index" xs4>
        <v-card flat tile color="transparent">
          <v-progress-circular v-if="!attachment.url" class="fast-animation" color="primary" :size="100" :width="15" :value="attachment.progress">
            {{ attachment.progress }}
          </v-progress-circular>
          <v-img v-else :src="attachment.url" height="100px" @click.stop="selectedAttachment=attachment"/>
        </v-card>
      </v-flex>

      <v-flex v-if="showAdd" xs4>
        <v-btn outline color="grey darken-1" class="upload-file" @click="$refs.inputUpload.click()">
          <div>
            <v-icon large>add_a_photo</v-icon>
          </div>
        </v-btn>
        <input v-show="false" v-if="showFileInput" ref="inputUpload" type="file" accept="image/*" @change="uploadFile"/>
      </v-flex>

    </v-layout>
    <v-dialog :value="selectedAttachment !== null" fullscreen hide-overlay>
      <v-card color="grey darken-4">
        <v-layout column class="fullscreen-attachment-container">
          <v-toolbar dark flat fixed class="fullscreen-attachment-nav">
            <v-spacer/>
            <v-btn icon @click="selectedAttachment=null">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          <v-layout fill-height justify-center align-center>
            <v-img v-if="selectedAttachment" :src="selectedAttachment.url" contain/>
          </v-layout>
        </v-layout>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Storage from '@aws-amplify/storage';

export default {
  name: 'AttachmentsGrid',
  props: {
    attachments: {
      type: Array,
      default() { return []; },
    },
    // show add button
    showAdd: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showFileInput: true,
      selectedAttachment: null,
    };
  },
  methods: {
    async uploadFile(e) {
      if (e.target.files && e.target.files.length) {
        const file = e.target.files[0];
        // TODO alert user that file is too large
        // if (e.target.files[0].size > config.MAX_ATTACHMENT_SIZE) {
        // this.resetFileInput();
        this.resetFileInput();

        const filename = `${Date.now()}-${file.name}`;
        const item = {
          progress: 0,
          key: null,
          url: '',
        };
        this.$emit('update:attachments', [...this.attachments, item]);
        const { key } = await Storage.vault.put(filename, file, {
          contentType: file.type,
          progressCallback: (progress) => {
            item.progress = Math.round((progress.loaded / progress.total) * 100);
          },
        });

        item.key = key;
        item.url = await Storage.vault.get(item.key);
      }
    },
    resetFileInput() {
      this.showFileInput = false;
      this.$nextTick(() => {
        this.showFileInput = true;
      });
    },
  },
};
</script>

<style lang="stylus">
.upload-file {
  margin: 0;
  width: 100px;
  height: 100px;
  border-style: dashed !important;
  border-width: 2px !important;
}

.fast-animation .v-progress-circular__overlay {
  transition: all 0.1s ease-in-out;
}

.fullscreen-attachment-container {
  height: 100vh;
}

.fullscreen-attachment-nav {
  background-color: rgba(33, 33, 33, 0.6) !important;
}
</style>
