import axios from 'axios'
import { LinearProject } from '../types'

export const query = `
query ($teamId: String!) {
  team(id: $teamId) {
    projects {
        nodes {
            id
            name
        }
    }
  }
}`

export const getLinearProjects = async (token: string, teamId: string): Promise<LinearProject[]> => {
  try {
    const { data } = await axios.post(
      'https://api.linear.app/graphql',
      {
        query,
        variables: {
          teamId
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )

    const { data: linearData, errors } = data;
    if (errors) {
      let errorMsg = errors[0]?.extensions?.userPresentableMessage
      throw new Error(errorMsg)
    }
    return linearData.team.projects.nodes;
  } catch (error: any) {
    console.error("Error doing 'getLinearProjects", error)
    const status = error?.response?.status
    const errorCode = error?.response?.data?.errors[0]?.extensions?.code
    if (status === 400 && errorCode === 'AUTHENTICATION_ERROR') {
      throw new Error("AUTHENTICATION_ERROR")
    }
    throw error;
  }
}