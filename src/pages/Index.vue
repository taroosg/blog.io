<template>
  <Layout :show-logo="false">
    <!-- Author intro -->
    <Author :show-title="true" />

    <!-- List posts -->
    <div class="posts">
      <PostCard v-for="edge in $page.posts.edges" :key="edge.node.id" :post="edge.node" />
    </div>
    <Adsense
      class="mb-5"
      ad-client="pub-7365457617485825"
      ad-slot="8131664210"
      ad-style="display:block !important;"
      ad-format="auto"
    ></Adsense>
  </Layout>
</template>

<page-query>
{
  posts: allPost(filter: { published: { eq: true }}) {
    edges {
      node {
        id
        title
        path
        tags {
          id
          title
          path
        }
        date (format: "D. MMMM YYYY")
        timeToRead
        description
        ...on Post {
            id
            title
            path
        }
      }
    }
  }
}
</page-query>

<script>
import Author from "~/components/Author.vue";
import PostCard from "~/components/PostCard.vue";
import Adsense from "~/components/Adsense.vue";

export default {
  components: {
    Author,
    PostCard,
    Adsense
  },
  metaInfo: {
    title: "Prisma Code"
  }
};
</script>
