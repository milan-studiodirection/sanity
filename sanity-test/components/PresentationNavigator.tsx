import {useEffect, useState} from 'react'
import {useClient} from 'sanity'
import {usePresentationNavigate} from 'sanity/presentation'
import {DocumentTextIcon, HomeIcon, TagIcon, ImagesIcon} from '@sanity/icons'
import {Box, Button, Card, Spinner, Stack, Text} from '@sanity/ui'

type Post = {_id: string; title: string; slug: string | null}
type Tag = {_id: string; name: string; slug: string | null}

export function PresentationNavigator() {
  const navigate = usePresentationNavigate()
  const client = useClient({apiVersion: '2024-01-01'})

  const [posts, setPosts] = useState<Post[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.fetch<Post[]>(
        `*[_type == "post"] | order(publishedAt desc) {_id, title, "slug": slug.current}`,
      ),
      client.fetch<Tag[]>(
        `*[_type == "tag"] | order(name asc) {_id, name, "slug": slug.current}`,
      ),
    ]).then(([fetchedPosts, fetchedTags]) => {
      setPosts(fetchedPosts)
      setTags(fetchedTags)
      setLoading(false)
    })
  }, [client])

  return (
    <Card height="fill" overflow="auto" tone="default">
      <Stack space={1} padding={3}>
        {/* Static pages */}
        <Box paddingBottom={1}>
          <Text size={0} weight="semibold" muted>
            Pages
          </Text>
        </Box>

        <Button
          mode="bleed"
          icon={HomeIcon}
          text="Homepage"
          justify="flex-start"
          fontSize={1}
          onClick={() => navigate('/')}
        />
        <Button
          mode="bleed"
          icon={ImagesIcon}
          text="Blog"
          justify="flex-start"
          fontSize={1}
          onClick={() => navigate('/blog')}
        />

        {/* Posts */}
        <Box paddingTop={3} paddingBottom={1}>
          <Text size={0} weight="semibold" muted>
            Posts
          </Text>
        </Box>

        {loading ? (
          <Box padding={3}>
            <Spinner muted />
          </Box>
        ) : posts.length === 0 ? (
          <Text size={1} muted>
            No posts yet
          </Text>
        ) : (
          posts.map((post) => (
            <Button
              key={post._id}
              mode="bleed"
              icon={DocumentTextIcon}
              text={post.title ?? 'Untitled'}
              justify="flex-start"
              fontSize={1}
              onClick={() => post.slug && navigate(`/blog/${post.slug}`)}
            />
          ))
        )}

        {/* Tags */}
        <Box paddingTop={3} paddingBottom={1}>
          <Text size={0} weight="semibold" muted>
            Tags
          </Text>
        </Box>

        {loading ? null : tags.length === 0 ? (
          <Text size={1} muted>
            No tags yet
          </Text>
        ) : (
          tags.map((tag) => (
            <Button
              key={tag._id}
              mode="bleed"
              icon={TagIcon}
              text={tag.name}
              justify="flex-start"
              fontSize={1}
              onClick={() => tag.slug && navigate(`/blog/tag/${tag.slug}`)}
            />
          ))
        )}
      </Stack>
    </Card>
  )
}
