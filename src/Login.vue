<template>
  <div>
    <input v-model="email" placeholder="Email" />
    <input v-model="password" type="password" placeholder="Password" />
    <button @click="login">Sign In</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { auth } from '@/firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const email = ref('');
const password = ref('');

const login = async () => {
  await signInWithEmailAndPassword(auth, email.value, password.value);
};
</script>
