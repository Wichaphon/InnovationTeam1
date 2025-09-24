import { useUser } from '@/features/user/hooks/useUser';
import type { UserEntity } from '@/types/type';

const mock: UserEntity = {
  id: "12345",
  email: "doe@gmail.com",
  fname: "John",
  lname: "doe",
  role: {
    name: "user"
  }
}

export const UserAccountPage = () => {
  const { data: user, isLoading, error, refetch } = useUser();
  if (isLoading) return <div>Loading profile...</div>
  if (error) {
    const err = error as any;
    const status = err?.response?.status;
    const message = err?.response.message;
      err?.response?.data?.message ||
      (status === 404 ? "User not found" : err.message);

    return (
      <div>
        <p>Error: {message}</p>
        <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  }

  return (
    <div className='flex justify-between space-x-6'>
      {/* personal detail column */}
      <div className='flex flex-col justify-stretch space-y-4'>
        <h1 className='text-primary text-2xl '>Personal Detail</h1>
        {/* Avatar */}
        <div className='box-border h-64 w-full bg-gray-600 rounded-3xl'></div>
        <h1 className='text-primary text-2xl '>Address</h1>
        {/* Address detail */}
        <div className='flex flex-col space-y-4'>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>Address Line</div>
            <div>Fill for address</div>
          </div>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>City</div>
            <div>Fill for address</div>
          </div>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>State</div>
            <div>Fill for address</div>
          </div>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>country</div>
            <div>Fill for address</div>
          </div>
        </div>
      </div>
      {/* name column */}
      <div className="flex flex-col pt-10 justify-start">
        <div className='flex flex-col space-y-4'>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>Name</div>
            <p>{user?.fname} {user?.lname}</p>
          </div>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>Role</div>
            <p>{user?.role?.name}</p>
          </div>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>Email</div>
            <div>{user?.email}</div>
          </div>
          <div className='space-y-0.5'>
            <div className='text-gray-500 text-sm'>ID</div>
            <div>{user?.id}</div>
          </div>
        </div>
      </div>
      {/* document column */}
      <div>
        <h1>Personal Id</h1>
      </div>
    </div>
  )
}