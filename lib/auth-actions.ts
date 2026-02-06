'use server'

import { Redis } from '@upstash/redis'
import * as bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

interface User {
  id: string
  username: string
  email: string
  passwordHash: string
}

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function signup(
  username: string,
  email: string,
  password: string
) {
  try {
    if (!username || !email || !password) {
      return { error: 'All fields are required.' }
    }

    if (username.length < 3) {
      return { error: 'Username must be at least 3 characters.' }
    }

    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters.' }
    }

    const existingUsername = await redis.get(`username:${username.toLowerCase()}`)
    if (existingUsername) {
      return { error: 'Username is already taken.' }
    }

    const existingEmail = await redis.get(`email:${email.toLowerCase()}`)
    if (existingEmail) {
      return { error: 'Email is already in use.' }
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)

    const userId = generateId()
    const user: User = {
      id: userId,
      username,
      email,
      passwordHash,
    }

    await redis.set(`user:${userId}`, JSON.stringify(user))
    await redis.set(`username:${username.toLowerCase()}`, userId)
    await redis.set(`email:${email.toLowerCase()}`, userId)

    const cookieStore = await cookies()
    cookieStore.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    redirect('/')
  } catch (error) {
    console.error('[v0] Signup error:', error)
    return { error: 'An error occurred during signup.' }
  }
}

export async function login(
  usernameOrEmail: string,
  password: string
) {
  try {
    if (!usernameOrEmail || !password) {
      return { error: 'All fields are required.' }
    }

    const userIdFromUsername = await redis.get(
      `username:${usernameOrEmail.toLowerCase()}`
    )
    const userIdFromEmail = await redis.get(
      `email:${usernameOrEmail.toLowerCase()}`
    )

    const userId = (userIdFromUsername as string) || (userIdFromEmail as string)

    if (!userId) {
      return { error: 'Invalid username/email or password.' }
    }

    const userData = await redis.get(`user:${userId}`)
    if (!userData) {
      return { error: 'Invalid username/email or password.' }
    }

    const user = JSON.parse(userData as string) as User
    const passwordMatch = await bcrypt.compare(password, user.passwordHash)

    if (!passwordMatch) {
      return { error: 'Invalid username/email or password.' }
    }

    const cookieStore = await cookies()
    cookieStore.set('userId', userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    redirect('/')
  } catch (error) {
    console.error('[v0] Login error:', error)
    return { error: 'An error occurred during login.' }
  }
}

export async function logout() {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('userId')
    redirect('/login')
  } catch (error) {
    console.error('[v0] Logout error:', error)
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return null
    }

    const userData = await redis.get(`user:${userId}`)
    if (!userData) {
      return null
    }

    const user = JSON.parse(userData as string) as User
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    }
  } catch (error) {
    console.error('[v0] Get current user error:', error)
    return null
  }
}
