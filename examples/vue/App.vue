<template>
  <div class="px-5">
    <h1 class="text-2xl font-bold">Robo Wizard</h1>

    <p class="font-semibold mb-8 underline uppercase">
      {{wizard.currentStep}} step
    </p>

    <form v-on:submit.prevent="onSubmit">
      <div v-if="wizard.currentStep === 'first'">
        <label
          for="firstName"
          id="firstName-label"
          class="block mb-2"
        >
          First Name:
        </label>
        <input
          class="border-2 border-solid border-gray-600 px-4 py-2"
          type="text"
          name="firstName"
          id="firstName"
          aria-label="firstName-label"
          :value="wizard.currentValues.firstName"
        />
      </div>

      <div v-else-if="wizard.currentStep === 'second'">
        <label
          for="lastName"
          id="lastName-label"
          class="block mb-2"
        >
          Last Name:
        </label>
        <input
          class="border-2 border-solid border-gray-600 px-4 py-2"
          type="text"
          name="lastName"
          id="lastName"
          aria-label="lastName-label"
          :value="wizard.currentValues.lastName"
        />
      </div>

      <div v-else-if="wizard.currentStep === 'third'">
        <p class="text-green-600">
          Welcome {{fullName}}!
        </p>
      </div>

      <div class="flex w-32 mt-8 justify-between">
        <button
          type="button"
          v-on:click="wizard.goToPreviousStep()"
          class="p-3 mr-4"
        >
          Previous
        </button>
          <button type="submit" class="py-3 px-8 border-2 border-gray-900">
          Next
        </button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { createWizard } from '../../src';

export default Vue.extend({
  beforeCreate() {
    this.wizard = createWizard(['first', 'second', 'third']);
    this.wizard.start(wizard => {
      this.$forceUpdate();
    );
  },

  computed: {
    fullName() {
      return `${this.wizard.currentValues.firstName} ${this.wizard.currentValues.lastName}`;
    }
  },

  methods: {
    onSubmit(event) {
      const data = new FormData(event.target as HTMLFormElement);
      const values = {};
      data.forEach((value, field) => {
        values[field] = value;
      });
      this.wizard.goToNextStep({ values });
    }
  }
});
</script>
