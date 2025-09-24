import prisma from "@/utils/prisma";

export const AccountRepo =  {
  async findByProviderAccountId(provider: string, providerAccountId: string) {
    return prisma.account.findUnique({
      where: {
        provider_providerAccountId: { provider, providerAccountId }
      }
    })
  },
  async updateToken(accountId:string, accessToken:string, refreshToken?:string){
    await prisma.account.update({
        where: { id: accountId },
        data: {
            access_token: accessToken,
            refresh_token: refreshToken,
            expiresAt: new Date(Date.now() + /* set expiry from profile or some default */ 0),  // better to parse profile if includes expiry
        }
    });
  }
  ,

  async create(data: {
    userId: string;
    type: string;
    provider: string;
    providerAccountId: string;
    access_token: string;
    refresh_token?: string;
    expiresAt: Date;
    scope?: string;
    token_type?: string;
    id_token?: string;
    session_state?: string;
  }) {
    return prisma.account.create({ data });
  },

  async accountUpdate(account:any, accessToken:string, refreshToken:string){

  }
}
