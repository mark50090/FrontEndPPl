<template>
<v-dialog v-model="dialog" scrollable persistent max-width="800">
<v-card>
        <v-card-title class="py-2 condition-header "  >
          {{textLang.Workflow_Condition_Setting}}
        </v-card-title>
        <v-card-text class="pt-4">
        <h3 class="condition-wf-hearder">{{textLang.Workflow_Condition_List}}</h3>
        <v-row class="mt-0 workflow-condition-modal-row" >
            <v-col cols="11" class="px-0">
                <v-card outlined class="pa-3 workflow-condition-group-card">
                    <u class="workflow-condition-group-title">{{textLang.Condition}} 1</u>
                    <v-row class="workflow-condition-modal-row">
                    <v-col cols='3' align-self="start" class="pl-0 workflow-condition-title">
                    {{textLang.Conditionon}}:
                    </v-col>
                    <v-col cols='9' class="px-0">
                                <v-textarea outlined dense no-resize rows="3" hide-details color="#4CAF50" class=" condition-help " >
                                <template v-slot:append-outer>
                                    <v-menu >
                                    <template v-slot:activator="{ on }">
                                        <v-btn x-small depressed dark fab color="primary" v-on="on">
                                        <v-icon>mdi-help</v-icon>
                                        </v-btn>
                                    </template>
                                    <v-card width="400">
                                        <v-card-text class="pr-1 help-workflow-condition-content">
                                        <p class="mb-0">{{textLang.help_order}}</p>
                                        <v-row class="workflow-condition-modal-row">
                                            <v-col cols="6" class="pl-0 pb-0">
                                            <ul>
                                                <li><b>+</b> : {{ textLang.help_card.plus_sign }}</li>
                                                <li><b>-</b> : {{ textLang.help_card.minus_sign }}</li>
                                                <li><b>*</b> : {{ textLang.help_card.multiple_sign }}</li>
                                                <li><b>/</b> : {{ textLang.help_card.divide_sign }}</li>
                                                <li><b>==</b> : {{ textLang.help_card.equal_sign }}</li>
                                                <li><b>!=</b> : {{ textLang.help_card.not_equal_sign }}</li>
                                                <li><b><</b> : {{ textLang.help_card.less_sign }}</li>
                                                <li><b><=</b> : {{ textLang.help_card.less_eq_sign }}</li>
                                                <li><b>></b> : {{ textLang.help_card.more_sign }}</li>
                                                <li><b>>=</b> : {{ textLang.help_card.more_eq_sign }}</li>
                                            </ul>
                                            </v-col>
                                            <v-col cols="6" class="px-0 pb-0">
                                            <ul>
                                                <li><b>.length</b> : {{ textLang.help_card.length_meaning }}</li>
                                                <li><b>&&</b> : {{ textLang.help_card.and_sign }}</li>
                                                <li><b>||</b> : {{ textLang.help_card.or_sign }}</li>
                                            </ul>
                                            </v-col>
                                        </v-row>
                                        <u>{{ textLang.help_card.condition_example }}</u>
                                        <br>
                                        <span>($inputbox1+$inputbox2<=$calculatebox3)||($inputbox4.length==13)</span>
                                        </v-card-text>
                                    </v-card>
                                    </v-menu>
                                </template>
                                </v-textarea>
                            </v-col>
                    </v-row>
                    <v-row class="workflow-condition-modal-row">
                    <v-col cols='3' align-self="center" class="pl-0 workflow-condition-title ">
                    {{textLang.Workflow}}:
                    </v-col>
                    <v-col cols='9' class="px-0"> 
                    <v-autocomplete class="workflow-text workflow-text-height workflow_dropdown"
                        color="#4caf50"
                        outlined
                        hide-details
                        dense
                        auto-select-first
                        append-icon="mdi-chevron-down"
                        ></v-autocomplete>
                    </v-col>
                    </v-row>
                </v-card>
            </v-col>
                <v-col cols="1" align-self="end" class="pr-0">
                <v-tooltip top>
                    <template v-slot:activator="{ on }">
                    <v-btn  outlined fab x-small v-on="on" color="#4CAF50" class="mb-2" >
                        <v-icon>mdi-minus</v-icon>
                    </v-btn>
                    </template>
                    <span>{{textLang.Delete_Condition}}</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                    <v-btn  depressed fab dark x-small v-on="on" color="#4CAF50"  >
                        <v-icon>mdi-plus</v-icon>
                    </v-btn>
                    </template>
                    <span>{{textLang.Add_Condition}}</span>
                </v-tooltip>
                </v-col>
        </v-row>
        </v-card-text>
        <v-divider class="mx-6"></v-divider>
        <v-card-actions class="py-5">
          <v-spacer></v-spacer>
          <v-btn outlined color="#67c25d" class="mr-4 workflow-condition-btn" @click="dialog=false">{{textLang.Cancel}}</v-btn>
          <v-btn depressed dark color="#67c25d" class="ml-4 workflow-condition-btn" @click="save()">{{textLang.Save}}</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
</v-card>        
</v-dialog>
</template>
<script>
import { EventBus } from '../EventBus'
export default {
    computed: {
    textLang () {
      return this.$store.getters.textLang.components.WorkflowConditionModal
    }
    },
    data: () => ({
        dialog: false
    }),
    mounted() {
         EventBus.$on('condition',this.conditionmodal)
    },
    methods: {
        conditionmodal() {
            this.dialog = true
        }
    }
}
</script>
<style>

.workflow-condition-modal-row {
    width: 100%;
    margin: 0%;
}
.workflow-condition-group-card {
    border: 2px solid #67c25d !important;
} 
.workflow-condition-group-title {
    font-family: 'Sarabun', sans-serif;
    color: #67c25d;
    font-size: 16px;
} 
.condition-header {
    font-family: "Sarabun", sans-serif;
    font-size: 16px !important;
    color: white;
    background-color: #67c25d;
}
.condition-wf-hearder {
    font-family: 'Sarabun', sans-serif;
    color: black;
}
.workflow-text{
  font-family: 'Sarabun', sans-serif;
  font-size: 13px ;
} 
.l-stamp.v-text-field input{
  line-height: 24px !important;
} 
.workflow-text-height.v-text-field input{
  line-height: 24px !important;
}
.workflow-condition-title {
    font-family: 'Sarabun', sans-serif;
    color: black;
    font-size: 16px;
}
.condition-help {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px;
}
.help-workflow-condition-content {
    font-family: 'Sarabun', sans-serif;
    font-size: 13px !important;
}
.workflow-condition-btn {
    font-family: 'Sarabun', sans-serif;
    text-transform: capitalize;
    font-size: 14px !important;
    width: 142px;
}    
.workflow_dropdown .mdi-chevron-down::before {
    color: #0000008A;
}
</style>