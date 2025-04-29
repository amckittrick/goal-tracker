import { ApolloError } from "@apollo/client";

export default function GQLError({error}: {error: ApolloError}) {
  return (
    <span className="text-primary">{error.message}</span>
  )
}