import type { Schema, Struct } from '@strapi/strapi';

export interface TwitterSocialLinks extends Struct.ComponentSchema {
  collectionName: 'components_twitter_social_links';
  info: {
    displayName: 'socialLinks';
    icon: 'twitter';
  };
  attributes: {
    facebook: Schema.Attribute.String;
    github: Schema.Attribute.String;
    instagram: Schema.Attribute.String;
    linkedin: Schema.Attribute.String;
    twitter: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'twitter.social-links': TwitterSocialLinks;
    }
  }
}
