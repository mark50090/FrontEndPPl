<template>
  <div class="pa-4">
    <v-row no-gutters>
      <v-col cols="12" sm="12" md="7">
        <v-row no-gutters>
          <v-col cols="12" sm="6">
            <v-row no-gutters>
              <v-col cols="12">
                <v-card outlined>
                  <v-toolbar color="white" dense flat>
                    <span>เอกสารทั้งหมด</span>
                  </v-toolbar>
                  <v-card height="73" flat>
                    <v-layout wrap fill-height justify-center="" align-baseline>
                      <span style="font-size: 34px">481</span>
                    </v-layout>
                  </v-card>
                </v-card>
              </v-col>
              <v-col cols="12" class="pt-4">
                <v-card outlined>
                  <v-toolbar color="white" dense flat>
                    <span style="font-size: 16px">สถานะทั้งหมด</span>
                    <!-- <v-chip
                  label
                  small
                  color="#67c25d"
                  text-color="white"
                  class="ml-1"
                  >All</v-chip
                > -->
                    <v-spacer></v-spacer>
                    <v-icon medium color="#67c25d">mdi-file-document</v-icon>
                    &nbsp;&nbsp;
                    <span>481</span>
                  </v-toolbar>
                  <v-card flat>
                    <v-layout wrap fill-height justify-center="" align-baseline>
                      <div class="py-2">
                        <span style="font-size: 16px"
                          >เอกสารกำลังดำเนินการ : 1</span
                        ><br />
                        <span style="font-size: 16px">เอกสารอนุมัติ : 452</span
                        ><br />
                        <span style="font-size: 16px"
                          >เอกสารปฏิเสธอนุมัติ : 22</span
                        ><br />
                        <span style="font-size: 16px">เอกสารถูกยกเลิก : 6</span
                        ><br />
                        <span style="font-size: 16px">เอกสารถูกลบ : 0</span
                        ><br />
                      </div>
                    </v-layout>
                  </v-card>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" sm="6" class="pl-sm-4 pt-4 pt-sm-0">
            <v-card outlined height="100%">
              <v-toolbar color="white" dense flat>
                <span>หัวข้อ1</span>
              </v-toolbar>
              <v-card flat height="73">
                <v-layout wrap fill-height justify-center="" align-baseline>
                  <span style="font-size: 34px">ข้อมูล1</span>
                </v-layout>
              </v-card>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { EventBus } from "../EventBus";
export default {
  data: () => ({
    axios_pending: 0,
  }),
  mounted() {
    EventBus.$emit("loadingOverlay", false);
  },
  watch: {
    axios_pending(val) {
      if (val > 0) EventBus.$emit("loadingOverlay", true);
      else EventBus.$emit("loadingOverlay", false);
    },
  },
  methods: {},
};
</script>

<style scoped>
* {
  font-family: "Sarabun", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.workflow-dashboard-page {
  height: calc(100vh - 72px);
  overflow: auto;
  padding-top: 1% !important;
}
</style>
