<template>
<v-dialog v-model="dialog" persistent max-width="450">
<v-card>
<v-card-text class=" pb-0 ">
    <v-row class="all-pass pt-6  " >
        <v-col  cols="auto" md="auto" lg="auto" class=" pl-0 pt-5 size-character-pass  font-color-pass " align-self="start">
        {{textLang.Password}} :
        </v-col>
        <v-col
            cols="8"
            md=""
            lg=""
            class="px-0 ">
            <v-text-field
            outlined
            dense
            v-model="text_password"
            color="#4caf50"
            :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show3 ? 'text' : 'password'"
            :placeholder="textLang.Please_input_the_password"
            :error="pass_error"
            :error-messages="message_error"
            class="text-box-pass height-pass"
            @click:append="show3 = !show3"
          ></v-text-field>
        </v-col>
    </v-row>
</v-card-text>
    <v-card-actions class="pb-2 pt-1 ">
      <v-row class="all-pass">
          <v-spacer></v-spacer>
          <v-col cols="6"
          md="5"
          lg="5"
          class="pr-2">
          <v-btn class="size-character-pass"
                  color="grey darken-1"
                  outlined
                  block
                  @click="back()"
                  >{{textLang.Back}}</v-btn>
                  </v-col>
          <v-col cols="6"
          md="5"
          lg="5"
          class="pl-2">
          <v-btn class="size-character-pass"
                  @click="set_password(text_password);dialog = false"
                  color="#4caf50"
                  dark
                  depressed
                  block
                  >{{textLang.Confirm}}</v-btn
                >
                </v-col><v-spacer></v-spacer>
        </v-row>
      </v-card-actions>
</v-card>
</v-dialog>

</template>

<script>
import { EventBus } from '../EventBus'
export default {
  computed: {
    textLang () {
      return this.$store.getters.textLang.components.PassPdf
    }
  },
  data: () => ({
    dialog: false,
    show3: false,
    pass_error: true,
    message_error: '',
    text_password: ''
  }),
  mounted () {
    EventBus.$on('passpdf', this.pass_pdf)
  },
  methods: {
    pass_pdf (callback, incorrent = false) {
      this.dialog = true
      this.text_password = ''
      this.pass_error = incorrent
      this.message_error = incorrent ? this.textLang.Password_is_incorrect : ''
      this.set_password = callback
    },
    back () {
      this.set_password('')
      this.$router.push({ path: '/inbox' })
    },
    set_password () {
      // set callback
      // EventBus.$emit('confirm_password', this.text_password)
    }
  },
  watch: {
    dialog (val) {
      if (!val) {
        this.set_password = null
      }
    }
  }
}
</script>
<style>
.all-pass{
  width: 100%;
  margin: 0% !important;
  }
.size-character-pass{
  font-family: 'Sarabun', sans-serif;
  font-size: 16px ;
  text-transform: capitalize;
  }
.text-box-pass{
  font-family: 'Sarabun', sans-serif;
  font-size: 13px ;
  }
.font-color-pass{
  color: black;
}
.height-pass.v-text-field input{
  line-height: 24px !important;
}

</style>
