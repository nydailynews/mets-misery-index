CREATE TABLE `poller_votes` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `question_id` int(11) NOT NULL,
      `answer_id` int(11) NOT NULL,
      `ip` varchar(30) COLLATE utf8_bin NOT NULL,
      `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `polls_id` (`polls_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;

CREATE TABLE `poller_answers` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `question_id` int(11) NOT NULL,
      `slug` varchar(100) COLLATE utf8_bin NOT NULL,
      `title` varchar(250) COLLATE utf8_bin NOT NULL,
      `votes` float NOT NULL,
      PRIMARY KEY (`id`),
      KEY `polls_id` (`polls_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;

CREATE TABLE `poller_questions` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `slug` varchar(100) COLLATE utf8_bin NOT NULL,
      `title` varchar(250) COLLATE utf8_bin NOT NULL,
      `votes` int(11) NOT NULL DEFAULT '0',
      `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY `id` (`id`),
      UNIQUE KEY `slug` (`slug`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1 ;

# Should we want to track guesses over time
CREATE TABLE `poller_count` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `items` int(11) DEFAULT '0' NOT NULL,
      `votes` int(11) DEFAULT '0' NOT NULL,
      `date_created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=utf8 COLLATE=utf8_bin AUTO_INCREMENT=1;
