
const prescript = `
CREATE TABLE IF NOT EXISTS comment
(
    username text COLLATE pg_catalog."default",
    id text COLLATE pg_catalog."default" NOT NULL,
    comment text COLLATE pg_catalog."default",
    "timestamp" bigint,
    isadmin boolean DEFAULT false,
    refers integer DEFAULT 0,
    refer text COLLATE pg_catalog."default",
    CONSTRAINT comment_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.visitors
(
    ip text COLLATE pg_catalog."default",
    "timestamp" text COLLATE pg_catalog."default" NOT NULL,
    id text COLLATE pg_catalog."default",
    CONSTRAINT visitors_pkey PRIMARY KEY ("timestamp")
)
`

module.exports = prescript