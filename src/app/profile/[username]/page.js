import Image from 'next/image';
import axios from 'axios';
import Input from '../../../../components/Input';

const getApplication = async (botToken) => {
  try {
    const response = await axios.get('https://discord.com/api/v10/applications/@me', {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error('Error getting application:', e);
    return null;
  }
};

const getRoles = async (botToken, guildId) => {
  try {
    const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/roles`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });
    return response.data;
  } catch (e) {
    console.error('Error getting roles:', e);
    return null;
  }
};

const fetchMember = async (guildId, username, botToken) => {
  try {
    const response = await axios.get(`https://discord.com/api/v10/guilds/${guildId}/members/search`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
      params: {
        query: username,
      },
    });
    return response.data[0] || null;
  } catch (error) {
    console.error('Error fetching member:', error);
    return null;
  }
};

const getUserDetails = async (userId, botToken) => {
  try {
    const response = await axios.get(`https://discord.com/api/v10/users/${userId}`, {
      headers: {
        Authorization: `Bot ${botToken}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (e) {
    console.error('User not found:', e);
    return null;
  }
};

// Function to display roles with color and emoji
const displayRoles = (roles) => (
  <div className="mt-1 ml-[17%] text-left w-full">
    <ul className="mt-2 flex">
      {roles.length > 0 ? (
        roles.map((role) => (
          <li key={role.id} className="mt-1 flex text-sm rounded-full mr-2  border-2 border-gray-400 p-1 items-center">
            {role.color ? (
              <div
                style={{
                  backgroundColor: `#${role.color.toString(16).padStart(6, '0')}`,
                }}
                className="w-3 h-3 rounded-full mr-2"
              />
            ) : (
              <div className="w-3 h-3 rounded-full mr-2" />
            )}
            {role.unicode_emoji && (
              <span className="mr-2">{role.unicode_emoji}</span>
            )}
            {role.name}
          </li>
        ))
      ) : (
        <p className="text-gray-400">No roles assigned.</p>
      )}
    </ul>
  </div>
);

const getUserBadges = (flags) => {
  const badges = [];

  if (flags & (1 << 0)) badges.push('Discord Employee');
  if (flags & (1 << 1)) badges.push('Partnered Server Owner');
  if (flags & (1 << 2)) badges.push('HypeSquad Events');
  if (flags & (1 << 3)) badges.push('Bug Hunter Level 1');
  if (flags & (1 << 6)) badges.push('HypeSquad Bravery');
  if (flags & (1 << 7)) badges.push('HypeSquad Brilliance');
  if (flags & (1 << 8)) badges.push('HypeSquad Balance');
  if (flags & (1 << 9)) badges.push('Early Supporter');
  if (flags & (1 << 10)) badges.push('Team User');
  if (flags & (1 << 14)) badges.push('Bug Hunter Level 2');
  if (flags & (1 << 16)) badges.push('Verified Bot');
  if (flags & (1 << 17)) badges.push('Early Verified Bot Developer');
  if (flags & (1 << 18)) badges.push('Discord Certified Moderator');

  return badges;
};

const HomePage = async ({ params }) => {
  const username = params.username;

  const botToken = process.env.NEXT_PUBLIC_BOT_TOKEN;
  const guildId = process.env.NEXT_PUBLIC_GUILD_ID;

  const userData = await fetchMember(guildId, username, botToken);
  const userDetails = await getUserDetails(userData.user.id, botToken);
  const guildRoles = await getRoles(botToken, guildId);

  const badges = getUserBadges(userDetails.public_flags);

  const userRoles = userData
    ? userData.roles.map((roleId) => {
        const role = guildRoles.find((r) => r.id === roleId);
        return role ? role : null;
      }).filter(role => role !== null)
    : [];

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg shadow-lg text-white max-w-lg w-[400px] h-[520px]">
        {userData ? (
          <div className="flex flex-col items-center">
           {userDetails.banner ? (
  <Image
    src={`https://cdn.discordapp.com/banners/${userDetails.id}/${userDetails.banner}.png?size=512`}
    alt="User Banner"
    width={700}
    height={200}
    style={{
      maxWidth: '100%',
      height: 'auto',
      borderRadius: '8px',
    }}
    className="rounded-lg mb-4"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = '/fallback-banner.png'; 
    }}
  />
) : (
  <div className="w-full h-52 bg-gray-600 rounded-lg mb-4 flex items-center justify-center text-white">
    No Banner Available
  </div>
)}


            <Image
              src={`https://cdn.discordapp.com/avatars/${userData.user.id}/${userData.user.avatar}.png`}
              alt="User Avatar"
              width={100}
              height={100}
              className="rounded-full -ml-[60%] -mt-16 border-sky-700 border-8"
            />

            <h1 className="mt-2 mr-[65%] text-2xl font-semibold">
              {userDetails.global_name || `${userDetails.username}#${userData.user.discriminator}`}
            </h1>
            <div className="flex -ml-[20%] mb-4">
              <h2 className="text-md font-semibold mr-4">
                {`${userDetails.username}#${userData.user.discriminator}`}
              </h2>
              <ul className="flex space-x-2">
                {badges.length > 0 ? (
                  badges.map((badge) => (
                    <li key={badge} className="text-gray-300">
                      <span className="bg-gray-700 px-2 py-1 rounded-full text-sm">{badge}</span>
                    </li>
                  ))
                ) : (
                  <p className="text-gray-400">No badges found.</p>
                )}
              </ul>
            </div>
            <h1 className='text-left ml-5 text-sm font-light'>Software developer | Building impactful solutions with React, Next.js, and Node.js. Passionate about tech and innovation.</h1>

            {displayRoles(userRoles)}

           
            <div className='w-[100%] ml-7 mt-2'>
            <Input placeholder={`msg ${userDetails.username}`}/>
            </div>
          </div>
        ) : (
          <p className="text-gray-400">User not found or loading...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
