<script lang="ts">
import { reactive, computed } from 'vue';
import { createWizard } from 'robo-wizard';

export default {
  setup() {
    const wizard = reactive(
      createWizard(['first', 'second', 'third'], { firstName: '', lastName: '' })
    );
    const fullName = computed(() => `${wizard.currentValues.firstName} ${wizard.currentValues.lastName}`);

    function onSubmit(event: Event) {
      console.log({ event })
      const data = new FormData(event.target as HTMLFormElement);
      const values = {};
      data.forEach((value, field) => {
        values[field] = value;
      });
      wizard.goToNextStep({ values });
    }

    return {
      wizard,
      fullName,
      onSubmit
    }
  },
  beforeCreate() {
    this.wizard.start(() => {
      this.$forceUpdate()
    })
  }
}
</script>

<template>
  <div class="px-5">
    <h1 class="text-2xl font-bold">Robo Wizard w/ Vue</h1>

    <p class="font-semibold mb-8 underline uppercase">{{ wizard.currentStep }} step</p>

    <form @submit.prevent="onSubmit">
      <div v-if="wizard.currentStep === 'first'">
        <label for="firstName" id="firstName-label" class="block mb-2">First Name:</label>
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
        <label for="lastName" id="lastName-label" class="block mb-2">Last Name:</label>
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
        <p class="text-green-600">Welcome {{ fullName }}!</p>
      </div>

      <div class="flex w-32 mt-8 justify-between">
        <button type="button" v-on:click="wizard.goToPreviousStep()" class="p-3 mr-4">Previous</button>
        <button type="submit" class="py-3 px-8 border-2 border-gray-900">Next</button>
      </div>
    </form>
  </div>
</template>

