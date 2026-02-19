import { defineStore } from 'pinia'
import { reactive, ref, computed } from 'vue'
import api from '../api'

export const useGlobalStore = defineStore('global', () => {

  // ── User State ────────────────────────────────────
  const user = reactive({
    token: localStorage.getItem('token'),
    _id: null,
    email: null,
    isAdmin: null,

    // FULL PROFILE FIELDS
    firstName: null,
    lastName: null,
    gender: null,
    age: null,
    status: null,
    hobbies: null,
    lookingFor: null,
    profileImage: null,

    isLoading: false
  })

  const cartCount = ref(0)

  // ── Computed ──────────────────────────────────────
  const isLoggedIn = computed(() => !!user.token)
  const isAdmin = computed(() => user.isAdmin === true)

  const servicesLink = computed(() => {
    return isLoggedIn.value && isAdmin.value
      ? '/products/all'
      : '/products/active'
  })

  // ── Get User Details ─────────────────────────────
  async function getUserDetails(token) {

    if (!token) {
      resetUser()
      return
    }

    user.isLoading = true

    try {
      const { data } = await api.get('/users/details')

      const userData = data.user || data

      user.token = token
      user._id = userData._id || null
      user.email = userData.email || null
      user.isAdmin = userData.isAdmin || false

      // FULL PROFILE DATA
      user.firstName = userData.firstName || null
      user.lastName = userData.lastName || null
      user.gender = userData.gender || null
      user.age = userData.age || null
      user.status = userData.status || null
      user.hobbies = userData.hobbies || null
      user.lookingFor = userData.lookingFor || null
      user.profileImage = userData.profileImage || null

      console.log('✅ User store fully updated:', user)

    } catch (err) {
      console.error('❌ Failed to fetch user details', err)
      resetUser()
    } finally {
      user.isLoading = false
    }
  }

  // ── Cart Count ───────────────────────────────────
  async function fetchCartCount() {
    try {
      const { data } = await api.get('/cart/get-cart')
      cartCount.value = data.cartItems ? data.cartItems.length : 0
    } catch {
      cartCount.value = 0
    }
  }

  // ── Logout ───────────────────────────────────────
  function logout() {
    resetUser()
    cartCount.value = 0
    localStorage.removeItem('token')
  }

  // ── Reset Helper ─────────────────────────────────
  function resetUser() {
    user.token = null
    user._id = null
    user.email = null
    user.isAdmin = null
    user.firstName = null
    user.lastName = null
    user.gender = null
    user.age = null
    user.status = null
    user.hobbies = null
    user.lookingFor = null
    user.profileImage = null
  }

  return {
    user,
    getUserDetails,
    cartCount,
    fetchCartCount,
    isLoggedIn,
    isAdmin,
    servicesLink,
    logout
  }

})
