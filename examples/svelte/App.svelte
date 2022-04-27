<script>
  import { createWizard } from '../../src';

  let wizard = createWizard(['first', 'second', 'third']);
  wizard.start(wiz => { wizard = wiz });

  function onSubmit(event) {
    const data = new FormData(event.target);
    const values = {};
    data.forEach((value, field) => {
      values[field] = value;
    });
    wizard.goToNextStep({ values });
  }

  $: fullName = `${wizard.currentValues.firstName} ${wizard.currentValues.lastName}`
</script>

<div class="px-8">
  <h1 class="text-2xl font-bold">Robo Wizard w/ Svelte</h1>

  <p class="font-semibold mb-8 underline uppercase">
    {wizard.currentStep} step
  </p>

  <form on:submit|preventDefault={onSubmit}>
    {#if wizard.currentStep === 'first'}
      <label for="firstName" id="firstName-label" class="block mb-2">
        First Name:
      </label>
      <input
        class="border-2 border-solid border-gray-600 px-4 py-2"
        type="text"
        name="firstName"
        id="firstName"
        aria-label="firstName-label"
        value={wizard.currentValues.firstName || ''}
      />
    {/if}

    {#if wizard.currentStep === 'second'}
      <label for="lastName" id="lastName-label" class="block mb-2">
        Last Name:
      </label>
      <input
        class="border-2 border-solid border-gray-600 px-4 py-2"
        type="text"
        name="lastName"
        id="lastName"
        aria-label="lastName-label"
        value={wizard.currentValues.lastName || ''}
      />
    {/if}

    {#if wizard.currentStep === 'third'}
      <p class="text-green-600">
        Welcome {fullName}!
      </p>
    {/if}

    <div class="flex w-32 mt-8 justify-between">
      <button
        type="button"
        on:click={() => wizard.goToPreviousStep()}
        class="p-3 mr-4"
      >
        Previous
      </button>
      <button type="submit" class="py-3 px-8 border-2 border-gray-900">
        Next
      </button>
    </div>
  </form>
</div>
