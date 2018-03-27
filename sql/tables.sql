CREATE TABLE `misery_votes` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `score` int(11) NOT NULL,
      `ip` varchar(30) COLLATE utf8_bin NOT NULL,
      `year` int(11) NOT NULL DEFAULT 2018,
      `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;

CREATE TABLE `misery_days` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `year` int(11) NOT NULL DEFAULT 2018,
      `score` float NOT NULL,
      `votes` int(11) NOT NULL,
      PRIMARY KEY (`id`),
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;

