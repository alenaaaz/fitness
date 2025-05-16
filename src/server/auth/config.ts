// src\server\auth\config.ts
import { PrismaAdapter } from "@auth/prisma-adapter";
import type { $Enums } from "@prisma/client";
import { type DefaultSession, type NextAuthConfig, type Session, type User } from "next-auth";
import EmailProvider from "next-auth/providers/nodemailer";
import { sendVerificationRequest } from "~/mailers/auth-mailer";
import { db } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: $Enums.UserRole;
      trainer?: {
        name: string;
        email: string;
      } | null;
    } & DefaultSession["user"];
  }

  //   interface User {
  //     // ...other properties
  //     role: $Enums.Role;
  //   }
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      sendVerificationRequest: sendVerificationRequest,
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    async session({ session, user }: { session: Session; user?: User }) {
      // Добавляем информацию о тренере, если это пользователь с ролью 'USER'
      if (session?.user.role === 'USER' && user?.id) {
        const userWithTrainer = await db.user.findUnique({
          where: { id: user.id },
          include: {
            trainer: true, // Подключаем тренера пользователя
          },
        });

        if (userWithTrainer?.trainer) {
          session.user.trainer = {
            name: userWithTrainer.trainer.name ?? 'Без имени',
            email: userWithTrainer.trainer.email ?? 'Без email',
          };
        } else {
          session.user.trainer = null; // Если тренера нет, то null
        }
      }

      return session;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
  },
  //   session: {
  //     strategy: "jwt",
  //   },
  //   pages: {
  //     signIn: "/auth/signin", // Путь к странице входа
  //   },
  // }
  // callbacks: {
  //   session: ({ session, user }) => ({
  //     ...session,
  //     user: {
  //       ...session.user,
  //       id: user.id,
  //       role: (user as any).role,
  //     },
  //   }),
  // },

} satisfies NextAuthConfig;


// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { type DefaultSession, type NextAuthConfig } from "next-auth";
// import type { Session, User } from "next-auth";
// import type { JWT } from "next-auth/jwt";
// import EmailProvider from "next-auth/providers/nodemailer";
// import { sendVerificationRequest } from "~/mailers/auth-mailer";
// import { db } from "~/server/db";

// declare module "next-auth" {
//   interface Session extends DefaultSession {
//     user: {
//       id: string;
//       role?: string;
//       trainer?: {
//         name: string;
//         email: string;
//       } | null;
//     } & DefaultSession["user"];
//   }
// }

// export const authConfig = {
//   providers: [
//     EmailProvider({
//       server: process.env.EMAIL_SERVER,
//       from: process.env.EMAIL_FROM,
//       sendVerificationRequest,
//     }),
//   ],
//   adapter: PrismaAdapter(db),
//   callbacks: {
//     async session({ session, token }: { session: Session; token: JWT }) {
//       if (session?.user && token?.sub) {
//         const user = await db.user.findUnique({
//           where: { id: token.sub },
//           include: { trainer: true },
//         });

//         if (user) {
//           session.user.trainer = user.trainer && user.trainer.name && user.trainer.email
//             ? {
//               name: user.trainer.name,
//               email: user.trainer.email,
//             }
//             : null;

//         }
//       }

//       return session;
//     },
//     async jwt({ token, user }: { token: JWT; user?: User }) {
//       if (user) {
//         token.sub = user.id;
//       }
//       return token;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   pages: {
//     signIn: "api/auth/signin",
//   },
// } satisfies NextAuthConfig;

// // import { PrismaAdapter } from "@auth/prisma-adapter";
// // import { type DefaultSession, type NextAuthConfig } from "next-auth";
// // import type { Session, User } from "next-auth";
// // import type { JWT } from "next-auth/jwt";
// // import EmailProvider from "next-auth/providers/nodemailer";
// // import { sendVerificationRequest } from "~/mailers/auth-mailer";
// // import { db } from "~/server/db";

// // /**
// //  * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
// //  * object and keep type safety.
// //  *
// //  * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
// //  */
// // declare module "next-auth" {
// //   interface Session extends DefaultSession {
// //     user: {
// //       id: string;
// //       role?: string;
// //       trainer?: {
// //         name: string;
// //         email: string;
// //       } | null;
// //       // ...other properties
// //       // role: UserRole;
// //     } & DefaultSession["user"];
// //   }

// //   // interface User {
// //   //   // ...other properties
// //   //   // role: UserRole;
// //   // }
// // }

// // /**
// //  * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
// //  *
// //  * @see https://next-auth.js.org/configuration/options
// //  */
// // export const authConfig = {
// //   providers: [
// //     EmailProvider({
// //       server: process.env.EMAIL_SERVER,
// //       from: process.env.EMAIL_FROM,
// //       sendVerificationRequest,
// //     }),
// //   ],
// //   adapter: PrismaAdapter(db),
// //   async session({ session, token }: { session: Session; token: JWT }) {
// //     if (session?.user && token?.sub) {
// //       const user = await db.user.findUnique({
// //         where: { id: token.sub },
// //         include: { trainer: true },
// //       });

// //       if (user) {
// //         session.user.id = user.id;
// //         session.user.role = user.role;
// //         session.user.trainer = user.trainer
// //           ? {
// //             name: user.trainer.name,
// //             email: user.trainer.email,
// //           }
// //           : null;
// //       }
// //     }

// //     return session;
// //   },
// //   async jwt({ token, user }: { token: JWT; user?: User }) {
// //     if (user) {
// //       token.sub = user.id;
// //     }
// //     return token;
// //   },
// // },
// //   session: {
// //     strategy: "jwt",
// //   },
// //   pages: {
// //     signIn: "/auth/signin",
// //   },
// //   // callbacks: {
// //   //   session: ({ session, user }) => ({
// //   //     ...session,
// //   //     user: {
// //   //       ...session.user,
// //   //       id: user.id,
// //   //     },
// //   //   }),
// //   // },
// // } satisfies NextAuthConfig;
// // // function EmailProvider(arg0: { server: string | undefined; from: string | undefined; sendVerificationRequest: any; }) {
// // //   throw new Error("Function not implemented.");
// // // }

