import axios from 'axios'
import { left, right } from '@sweet-monads/either'
import type { Either } from '@sweet-monads/either'
import type { Static } from 'runtypes'
import { Literal } from 'runtypes'
import { SERVICE_UNAVAILABLE } from './statuses'
import { URLS_CONFIG } from './urls.config'

export const DEFAULT_PAGE_SIZE = 20

interface FindReposParams {
  page: number
  searchString: string
}

interface RepositoryInfoDTO {
  id: number
  name: string
  owner: {
    login: string
  }
  description: string
  language: string
  stargazers_count: number
}

interface FindReposDTO {
  total_count: number
  items: Array<RepositoryInfoDTO>
}

export interface RepositoryInfo {
  id: number
  name: string
  owner: string
  description: string
  language: string
  stars: number
}

interface FindReposSuccessResult {
  totalCount: number
  repos: Array<RepositoryInfo>
}

export const ServerUnavailableError = Literal('The service is unavailable now')

export const findRepos = async({
  page,
  searchString,
}: FindReposParams): Promise<
  Either<
  Static<typeof ServerUnavailableError>,
  FindReposSuccessResult
  >
> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      q: searchString,
      per_page: DEFAULT_PAGE_SIZE.toString(),
    })

    const response = await axios.get<FindReposDTO>(URLS_CONFIG.SEARCH.REPOSITORIES, { params })
    const { items: rawRepos, total_count: totalCount } = response.data

    const repos = rawRepos.map(repo => ({
      id: repo.id,
      name: repo.name,
      owner: repo.owner.login,
      description: repo.description,
      language: repo.language,
      stars: repo.stargazers_count,
    }))

    return right({ totalCount, repos })
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.code === SERVICE_UNAVAILABLE)
        return left(ServerUnavailableError.value)
    }

    throw error
  }
}
