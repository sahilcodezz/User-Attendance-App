import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          'https://jsonplaceholder.typicode.com/users'
        )

        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }

        const data = await response.json()

        setUsers(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <h1>Loading users...</h1>
  }

  if (error) {
    return <h1>Error: {error}</h1>
  }

  return (
    <div>
      <h1>All Users</h1>

      {users.map((user) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>

          <Link to={`/users/${user.id}`}>
            View Profile
          </Link>

          <hr />
        </div>
      ))}
    </div>
  )
}

export default Users