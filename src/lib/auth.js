import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { supabase } from './supabase'

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        usuario: { label: 'Usuario', type: 'text' },
        contraseña: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.usuario || !credentials?.contraseña) {
          return null
        }

        const { data: user, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('usuario', credentials.usuario)
          .single()

        if (error || !user) {
          return null
        }

        const isValidPassword = await bcrypt.compare(credentials.contraseña, user.contraseña)

        if (!isValidPassword) {
          return null
        }

        return {
          id: user.id,
          usuario: user.usuario
        }
      }
    })
  ],
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.usuario = user.usuario
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.sub
      session.user.usuario = token.usuario
      return session
    }
  }
}

export default NextAuth(authOptions)
