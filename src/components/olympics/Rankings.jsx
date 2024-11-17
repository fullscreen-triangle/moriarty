const people = [
    {
      name: 'Leslie Alexander',
      email: 'leslie.alexander@example.com',
      role: 'Co-Founder / CEO',
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      lastSeen: '3h ago',
      lastSeenDateTime: '2023-01-23T13:23Z',
      activityLevel: 80, // Percentage for bullet chart length
    },
    // Add similar entries for other people
  ];
  
  export default function Rankings() {
    return (
      <ul role="list" className="divide-y divide-gray-700 bg-gray-900 p-4">
        {people.map((person) => (
          <li key={person.email} className="flex flex-col sm:flex-row justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4 items-center">
              <img
                alt=""
                src={person.imageUrl}
                className="h-12 w-12 flex-none rounded-full bg-gray-800"
              />
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold text-gray-100">{person.name}</p>
                <p className="mt-1 truncate text-xs text-gray-400">{person.email}</p>
  
                {/* Bullet Chart */}
                <div className="mt-2 h-2 bg-gray-700 rounded">
                  <div
                    className="h-full bg-blue-600 rounded"
                    style={{ width: `${person.activityLevel}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 hidden sm:flex sm:flex-col sm:items-end">
              <p className="text-sm text-gray-100">{person.role}</p>
              {person.lastSeen ? (
                <p className="mt-1 text-xs text-gray-400">
                  Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    );
  }
  