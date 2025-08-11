<template>
  <div class="container mx-auto px-4 py-8 max-w-4xl">
    <h1 class="text-3xl font-bold mb-8">Privacy Policy – cfb-score-bot</h1>
    
    <div class="prose max-w-none">
      <p class="text-gray-600 mb-6">Last Updated: August 11, 2025</p>
      
      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">1. Information We Collect</h2>
        <p class="mb-4">
          When you add and configure cfb-score-bot, we collect and store:
        </p>
        <ul class="list-disc ml-6 mb-4">
          <li>Discord server IDs</li>
          <li>Discord channel IDs designated for broadcasts</li>
          <li>Configuration settings you provide (e.g., selected games, conferences, broadcast types)</li>
        </ul>
        <p class="mb-4">
          We do not collect or store message content from your server, except as needed to process commands in real time.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent mb-4">2. How We Use Your Information</h2>
        <p class="mb-4">
          We use the information collected solely to:
        </p>
        <ul class="list-disc ml-6 mb-4">
          <li>Operate and deliver Bot functionality</li>
          <li>Maintain your configuration between sessions</li>
        </ul>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibold mb-4">3. Data Sharing</h2>
        <p class="mb-4">
          We do not sell, share, or otherwise disclose your information to any third party.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent mb-4">4. Data Retention</h2>
        <p class="mb-4">
          Configuration data is retained indefinitely unless you request its deletion by contacting us at admin@collegefootballdata.com.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent mb-4">5. Security</h2>
        <p class="mb-4">
          We take reasonable measures to protect stored data, but no method of transmission or storage is 100% secure.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent mb-4">6. Your Rights</h2>
        <p class="mb-4">
          You may request to view or delete your server's stored configuration data by contacting us at admin@collegefootballdata.com.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent mb-4">7. Children's Privacy</h2>
        <p class="mb-4">
          The Bot is intended for users aged 13 and older, in compliance with Discord's Terms of Service. We do not knowingly collect data from children under 13.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent mb-4">8. Changes to This Policy</h2>
        <p class="mb-4">
          We may update this Privacy Policy from time to time. Continued use of the Bot after changes are posted constitutes acceptance of the revised policy.
        </p>
      </section>

      <section class="mb-8">
        <h2 class="text-2xl font-semibent mb-4">9. Contact</h2>
        <p class="mb-4">
          For any privacy-related questions, contact: <a href="mailto:admin@collegefootballdata.com" class="text-blue-600 hover:text-blue-800">admin@collegefootballdata.com</a>
        </p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Privacy Policy – cfb-score-bot',
  meta: [
    { name: 'description', content: 'Privacy Policy for cfb-score-bot Discord bot' }
  ]
})
</script>