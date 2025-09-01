import { LEAGUE_ID } from '../lib/utils.js'
import logo from '../assets/kickbase_logo.png'

export const getLivePoints = async () => {
  const response = await fetch(
    `https://api.kickbase.com/v4/leagues/${LEAGUE_ID}/live`,
    {
      headers: { authorization: 'Bearer ' + import.meta.env.VITE_TOKEN },
    }
  )
  const data = await response.json()
  const ranks = data.u.sort((a, b) => b.t - a.t)
  return formatData(ranks)
}

const formatData = (data) => {
  const formatedData = data.map((user) => {
    return {
      id: user.id,
      name: user.n,
      livePoints: user.t,
      totalPoints: user.st,
      players: user.pl.map((player) => {
        return {
          id: player.id,
          teamId: player.tid,
          name: `${player.fn} ${player.n}`,
          points: player.t,
        }
      }),
    }
  })

  formatedData.forEach((user) => {
    user.players.sort((a, b) => b.points - a.points)
  })

  return formatedData
}

export const getRanks = async () => {
  //todo call: https://api.kickbase.com/v4/leagues/${LEAGUE_ID}/users/244959/teamcenter
  const response = await fetch(
    `https://api.kickbase.com/v4/leagues/${LEAGUE_ID}/ranking`,
    {
      headers: { authorization: 'Bearer ' + import.meta.env.VITE_TOKEN },
    }
  )
  const data = await response.json()
  const ranks = data.us.map((ele) => {
    return {
      id: ele.i,
      name: ele.n,
      livePoints: ele.mdp,
      totalPoints: ele.sp,
    }
  })
  ranks.sort((a, b) => b.livePoints - a.livePoints)
  return ranks.filter((user) => user.id !== '2032297')
}

export const getPlayerPoints = async (managerId) => {
  if (managerId === undefined) {
    return []
  }
  const response = await fetch(
    `https://api.kickbase.com/v4/leagues/${LEAGUE_ID}/users/${managerId}/teamcenter`,
    {
      headers: { authorization: 'Bearer ' + import.meta.env.VITE_TOKEN },
    }
  )
  const data = await response.json()
  const players = data.lp.map((ele) => {
    return { id: ele.id, name: ele.n, points: ele.p || 0, teamId: ele.tid }
  })
  players.sort((a, b) => b.points - a.points)
  return players
}

export const getLeague = async () => {
  const response = await fetch(
    'https://api.kickbase.com/v4/leagues/selection',
    {
      headers: { authorization: 'Bearer ' + import.meta.env.VITE_TOKEN },
    }
  )
  const data = await response.json()
  const currentLeague = data.it.find((league) => league.i === `${LEAGUE_ID}`)

  return {
    id: currentLeague.i,
    name: currentLeague.n,
    logo: currentLeague.f || logo,
  }
}
